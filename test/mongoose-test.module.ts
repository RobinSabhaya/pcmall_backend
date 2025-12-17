// import { DynamicModule } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { MongoMemoryServer } from 'mongodb-memory-server';

// export class MongooseMock {
//   private mongo: MongoMemoryServer;

//   async closeInMongod(): Promise<void> {
//     if (this.mongo != null) await this.mongo.stop();
//   }

//   async rootMongooseTestModule(): Promise<DynamicModule> {
//     this.mongo = await MongoMemoryServer.create();
//     const uri = this.mongo.getUri();

//     return MongooseModule.forRoot(uri);
//   }
// }
