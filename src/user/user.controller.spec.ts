// import { Test, TestingModule } from '@nestjs/testing';

// import { MongooseMock } from '../../test/mongoose-test.module';

// import { UserController } from './user.controller';
// import { UserService } from './user.service';

// describe('UserController', () => {
//   let controller: UserController;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       imports: [await new MongooseMock().rootMongooseTestModule()],
//       controllers: [UserController],
//       providers: [UserService],
//     }).compile();

//     controller = module.get<UserController>(UserController);
//   });

//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
// });
