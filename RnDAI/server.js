

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'http://localhost:4200', 
    credentials: true
  }));
app.use(express.json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Store API keys temporarily (in production, use a proper database)
const apiKeys = new Map();

// Gemini service
class GeminiService {
    constructor(apiKey) {
        this.genAI = new GoogleGenerativeAI(apiKey);
    }

    async generateContent(prompt, model = "gemini-1.5-flash") {
        const genModel = this.genAI.getGenerativeModel({ model });
        const result = await genModel.generateContent(prompt);
        return result.response.text();
    }
}

// Middleware to check for API key
const checkApiKey = (req, res, next) => {
    console.log('Received headers:', req.headers);
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
      console.log('Invalid API key:', apiKey);
      return res.status(401).json({ error: 'Invalid or missing API key' });
    }
    const userApiKey = Math.random().toString(36).substring(7);
    apiKeys.set(userApiKey, apiKey);
    req.geminiApiKey = apiKeys.get(userApiKey);
    console.log('Valid API key received');
    req.geminiService = new GeminiService(apiKeys.get(userApiKey));
    next();
  };
const path = require('path');
app.use(express.static(path.join(__dirname, '../gemini-angular-client/dist/gemini-angular-client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../gemini-angular-client/dist/gemini-angular-client/index.html'));
});

// Route to set API key
app.post('/set-api-key', (req, res) => {
    const { apiKey } = req.body;
    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }

    res.json({ userApiKey });
});

// Route for DB script creation
app.post('/create-db-script', checkApiKey, async (req, res) => {
    const { scriptType, scriptName, featureName, ownerId, featureValue, freeStyleDescription } = req.body;
    
    let prompt = '';
    if (scriptType === 'featureFlag') {
      const currentDate = new Date().toISOString().split('T')[0].replace(/-/g, '');
      prompt = `Create a SQL script to add a feature flag with the following details:
        - Script Name: ${scriptName}
        - Feature Name: ${featureName}
        - Owner ID: ${ownerId}
        - Feature Value: ${featureValue}
        - Current Date: ${currentDate}
        
        Use this template and adjust it according to the input:
        
        IF ([dbo].[GetLastExecutedPostDeploymentScriptVersion]('${currentDate}_${scriptName}') < 1)
          BEGIN
            PRINT 'Executing ${currentDate}_${scriptName}'
            IF ('$(ContinentCode)' IN ('EU','US') AND DB_NAME() IN ('ConsumerFinancing_Prod', 'ConsumerFinancing_UAT', 'ConsumerFinancing_Dev', 'ConsumerFinancing_Qa'))
            BEGIN
              IF NOT EXISTS (SELECT 1 FROM v_FeatureFlags WHERE FlagKey = '${featureName}')
              BEGIN
                exec AddFeature @Name = '${featureName}', @DataType='string', @Description='${scriptName}',@IsDeleted = 0,@Category ='SSP',@IsMerchantProfile  = 0,@Confidential = 0, @NeededBy  = 0 
              END
              
              IF NOT EXISTS (SELECT 1 FROM v_FeatureFlags WHERE OwnerId = '${ownerId}' AND FlagKey = '${featureName}')
              BEGIN
              exec AddFeatureValues @FeatureName = '${featureName}' , @SiteID = null, @MerchantId= '${ownerId}', @Value = '${featureValue}', @IsDeleted= 0
              END
            END		 
            INSERT PostDeploymentScripts (ScriptName, ScriptVersion, ExecutionUTCDate)
            VALUES ('${currentDate}_${scriptName}', 1, GETUTCDATE())
          END
        
        `;
    } else {
      prompt = `Create a SQL script based on the following description: ${freeStyleDescription}
      IF ([dbo].[GetLastExecutedPostDeploymentScriptVersion]('${currentDate}_${scriptName}') < 1)
      BEGIN
        PRINT 'Executing ${currentDate}_${scriptName}'
        IF ('$(ContinentCode)' IN ('EU','US') AND DB_NAME() IN ('ConsumerFinancing_Prod', 'ConsumerFinancing_UAT', 'ConsumerFinancing_Dev', 'ConsumerFinancing_Qa'))
        BEGIN
          generate the sql based on ${freeStyleDescription}
        END		 
        INSERT PostDeploymentScripts (ScriptName, ScriptVersion, ExecutionUTCDate)
        VALUES ('${currentDate}_${scriptName}', 1, GETUTCDATE())
      END
        `;
    }
    
    try {
      const result = await req.geminiService.generateContent(prompt);
      res.json({ generatedScript: result });
    } catch (error) {
      res.status(500).json({ error: 'Error generating DB script' });
    }
  });

// Route for build failure explanation
app.post('/explain-build-failure', checkApiKey, async (req, res) => {
    const { buildLog } = req.body;
    const prompt = `Explain the following build failure log and suggest possible solutions:
    ${buildLog}`;
    
    try {
        const result = await req.geminiService.generateContent(prompt);
        res.json({ explanation: result });
    } catch (error) {
        res.status(500).json({ error: 'Error explaining build failure' });
    }
});

// Route for log error explanation
app.post('/explain-log-error', checkApiKey, async (req, res) => {
    const { logError } = req.body;
    const prompt = `Explain the following log error and suggest possible solutions:
    ${logError}`;
    
    try {
        const result = await req.geminiService.generateContent(prompt);
        res.json({ explanation: result });
    } catch (error) {
        res.status(500).json({ error: 'Error explaining log error: ' + error.message });
    }
});

