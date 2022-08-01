import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse, SmallPokemon } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios : AxiosInstance = axios

constructor(
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
){}
  
 async executeSeed (){
    // delete where * from pokemons
  await this.pokemonModel.deleteMany({})

   const {data} =await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=10")

    

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
