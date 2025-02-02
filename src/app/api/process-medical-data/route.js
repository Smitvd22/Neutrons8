// app/api/process-medical-data/route.js
import { NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

const TIMEOUT_DURATION = 120000; // 2 minutes

export async function POST(request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Path to your Python script and results file
    const scriptPath = path.join(process.cwd(), 'src', 'app', 'api', 'symptom-analyzer', 'medical-results.py');
    const resultsPath = path.join(process.cwd(), 'src', 'app', 'api', 'symptom-analyzer', 'medical_results.json');
    
    // Check if Python script exists
    try {
      await fs.access(scriptPath);
      console.log('Script found at:', scriptPath);
    } catch (error) {
      console.error('Python script not found:', scriptPath);
      return NextResponse.json(
        { error: 'Analysis script not found' },
        { status: 500 }
      );
    }
    
    // Execute Python script
    return new Promise((resolve) => {
      let isResolved = false;
      
      // Check if python is available
      const pythonCommand = process.platform === 'win32' ? 'python' : 'python3';
      console.log('Using Python command:', pythonCommand);
      
      const pythonProcess = spawn(pythonCommand, [scriptPath, userId], {
        env: {
          ...process.env,
          PYTHONUNBUFFERED: '1' // This ensures Python prints output immediately
        }
      });
      
      let scriptOutput = '';
      let scriptError = '';

      pythonProcess.stdout.on('data', (data) => {
        const output = data.toString();
        scriptOutput += output;
        console.log('Python output:', output);
      });

      pythonProcess.stderr.on('data', (data) => {
        const error = data.toString();
        scriptError += error;
        console.error('Python error:', error);
      });

      pythonProcess.on('close', async (code) => {
        if (isResolved) return;
        console.log('Python process closed with code:', code);
        
        if (code !== 0) {
          console.error('Python script error:', scriptError);
          isResolved = true;
          resolve(NextResponse.json(
            { error: `Failed to process medical data: ${scriptError}` },
            { status: 500 }
          ));
          return;
        }

        try {
          // Wait a bit for the file to be written
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if results file exists
          try {
            await fs.access(resultsPath);
            console.log('Results file found at:', resultsPath);
          } catch (error) {
            console.error('Results file not found:', resultsPath);
            throw new Error('Results file not found after processing');
          }

          // Read the generated JSON file
          const resultsData = await fs.readFile(resultsPath, 'utf8');
          console.log('Raw results data:', resultsData);
          
          const results = JSON.parse(resultsData);
          console.log('Parsed results:', results);
          
          // Clean up the results file after reading
          await fs.unlink(resultsPath).catch(error => {
            console.error('Error cleaning up results file:', error);
          });
          
          isResolved = true;
          resolve(NextResponse.json(results));
        } catch (error) {
          console.error('Error reading/parsing results:', error);
          isResolved = true;
          resolve(NextResponse.json(
            { error: `Failed to read analysis results: ${error.message}` },
            { status: 500 }
          ));
        }
      });

      // Handle process errors
      pythonProcess.on('error', (error) => {
        if (isResolved) return;
        console.error('Process error:', error);
        isResolved = true;
        resolve(NextResponse.json(
          { error: `Failed to start analysis process: ${error.message}` },
          { status: 500 }
        ));
      });

      // Set a timeout for the process
      const timeoutId = setTimeout(() => {
        if (isResolved) return;
        console.error('Process timed out after', TIMEOUT_DURATION, 'ms');
        pythonProcess.kill();
        isResolved = true;
        resolve(NextResponse.json(
          { error: 'Analysis process timed out. Please try again.' },
          { status: 500 }
        ));
      }, TIMEOUT_DURATION);

      // Clean up timeout if process ends before timeout
      pythonProcess.on('exit', () => {
        clearTimeout(timeoutId);
      });
    });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: `Failed to process request: ${error.message}` },
      { status: 500 }
    );
  }
}