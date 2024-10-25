import { google } from 'googleapis';
import googleDriveCredentials from '../utils/googleDriveCredentials.js';
import { PassThrough } from 'stream';

class GoogleDriveService {
    constructor() {
        this.driveClient = this.createDriveClient();
    }

    createDriveClient() {
        const auth = new google.auth.GoogleAuth({
            credentials: googleDriveCredentials,
            scopes: ['https://www.googleapis.com/auth/drive.file']
        });

        return google.drive({ version: 'v3', auth });
    }

    bufferToStream(buffer) {
        const stream = new PassThrough();
        stream.end(buffer);
        return stream;
    }

    async createFolder(folderName) {
        try {
            const response = await this.driveClient.files.create({
                requestBody: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder',
                    parents: [process.env.GOOGLE_DRIVE_FOLDER_ID]
                },
                fields: 'id'
            })
            return response.data.id;
        } catch (error) {
            console.error('Error Creating Folder:', error)
        }
    }

    async uploadFile(fileObject, folderId, customName) {
        try {
            const fileStream = this.bufferToStream(Buffer.from(fileObject.buffer));

            const response = await this.driveClient.files.create({
                requestBody: {
                    name: customName || fileObject.originalname,
                    mimeType: fileObject.mimetype,
                    parents: [folderId]
                },
                media: {
                    mimeType: fileObject.mimetype,
                    body: fileStream
                }
            });

            // Set file to be publicly accessible
            await this.driveClient.permissions.create({
                fileId: response.data.id,
                requestBody: {
                    role: 'reader',
                    type: 'anyone'
                }
            });

            // Get the file's web view link
            const fileData = await this.driveClient.files.get({
                fileId: response.data.id,
                fields: 'webViewLink'
            });

            return {
                fileId: response.data.id,
                webViewLink: fileData.data.webViewLink
            };
        } catch (error) {
            console.error('Error uploading file to Google Drive:', error);
            throw error;
        }
    }
}

export default new GoogleDriveService();