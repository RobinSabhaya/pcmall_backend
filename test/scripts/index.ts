import { fixturesSeed } from './fixture.seed';

const index = async (): Promise<void> => {
  try {
    await fixturesSeed();
  } catch (error) {
    console.log('🚀 ~ error:', error);
  }
};

index().then;
