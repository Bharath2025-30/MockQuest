// Piston API is a service for code execution

import type { LanguageINfo, SupportedLanguage } from "@/data/Problems";

const PISTON_API_URL = 'https://emkc.org/api/v2/piston'

const LANGUAGE_VERSIONS : Record<SupportedLanguage, LanguageINfo>= {
    javascript: {language: 'javascript', version: '18.15.0'},
    python: {language: 'python', version: '3.10.0'},
    "java": {language: 'java', version: '15.0.2'},
}

export async function ExecuteCode(language: SupportedLanguage, sourceCode: string) : Promise<{success: boolean, output?:string, error?:string}> {
    try{
        const languageConfig = LANGUAGE_VERSIONS[language];
        if(!languageConfig){
            return {
                success: false,
                error: `Unsupported language: ${language}`
            }
        }

        const response = await fetch(PISTON_API_URL + '/execute', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                language: languageConfig.language,
                version: languageConfig.version,
                files: [
                    {
                        name: `main.${getFileExtension(language)}`,
                        content: sourceCode
                    }
                ]
            })
        });

        if(!response.ok){
            return {
                success: false,
                error: `Backend Error: ${response.status} ${response.statusText}`
            }
        }

        const data = await response.json();

        const output = data.run?.output || '';
        const stderr = data.run?.stderr || '';

        if(stderr && stderr.trim().length > 0){
            return {
                success: false,
                output: output,
                error: stderr
            }
        }

        // Code Executed successfully
        return {
            success: true,
            output: output || "No output"
        }
    }
    catch(error){
        return {
            success: false,
            error: `Error executing code: ${error}`
        }
    }
}

function getFileExtension(language: SupportedLanguage) : string {
    switch(language){
        case 'javascript':
            return 'js';
        case 'python':
            return 'py';
        case 'java':
            return 'java';
        default:
            return 'txt';
    }
    return '';
}

