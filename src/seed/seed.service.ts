import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse, SmallPokemon } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {



constructor(
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,

  private readonly http:AxiosAdapter ,
){}
  
 async executeSeed (){
    // delete where * from pokemons
  await this.pokemonModel.deleteMany({})

   const data  =await this.http.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=30")

    

    const dataClean  = data.results.map(({name,url})=>{
      
      const segment  = url.split('/') 
    
  return{
     name,
    "no" : +segment[segment.length - 2]
      }


    })
  
    await this.pokemonModel.insertMany(dataClean)

   return 'Seed Executed'
  }
}
