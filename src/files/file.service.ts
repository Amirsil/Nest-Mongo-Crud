import { Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import * as GridFsStorage from 'multer-gridfs-storage';
import { MongoGridFS } from 'mongo-gridfs'
import { GridFSBucketReadStream } from 'mongodb'
import { mongoose } from '@typegoose/typegoose';
import { FileInfo } from './file.dto';

const MONGO_URL = 'mongodb://localhost:27017/nest'

@Injectable()
export class GridFsStorageConfig implements MulterOptionsFactory {
    gridFsStorage;
    constructor() {
        this.gridFsStorage = new GridFsStorage.GridFsStorage({
            url: MONGO_URL,
            file: (req, file) => {
                console.log(file)
                return file
            }
        });
    }

    public createMulterOptions(): MulterModuleOptions {
        return { storage: this.gridFsStorage };
    }
}

@Injectable()
export class FilesService {
    private fileModel: MongoGridFS;

    constructor() {
        mongoose.connect(MONGO_URL)
            .then((mongoose => {
                this.fileModel = new MongoGridFS(mongoose.connection.db, 'fs')
            }));

    }

    async readStream(id: string): Promise<GridFSBucketReadStream> {
        return await this.fileModel.readFileStream(id);
    }

    async findInfo(id: string): Promise<FileInfo> {
        const result = await this.fileModel.findById(id)

        return {
            filename: result.filename,
            length: result.length,
            chunkSize: result.chunkSize,
            md5: result.md5,
            contentType: result.contentType
        }
    }

    async deleteFile(id: string): Promise<boolean> {
        return await this.fileModel.delete(id)
    }
}