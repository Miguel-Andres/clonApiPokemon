import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MongooseModule } from '@nestjs/mongoose';

import { join } from 'path';
import { PokemonModule } from './pokemon/pokemon.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';
import { envConfiguration } from './common/config/env.config';
import { JoiValidationSchema } from './common/config/joi.validation';

@Module({
  imports: [

    ConfigModule.forRoot({
      load: [envConfiguration] ,
      validationSchema : JoiValidationSchema ,

    }),
    
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..','public'),
    }),
    
    MongooseModule.forRoot(process.env.MONGODB),

    PokemonModule,

    CommonModule,
 
    SeedModule,

  ],
})
export class AppModule {

  // constructor(){
  //   console.log(process.env)
  // }
}
