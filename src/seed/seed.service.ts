import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';


@Injectable()
export class SeedService {

  private readonly axios : AxiosInstance = axios

constructor(
  @InjectModel(Pokemon.name)
  private readonly pokemonModel: Model<Pokemon>,
){}
  
 async executeSeed (){
   const {data} =await this.axios.get<PokeResponse>("https://pokeapi.co/api/v2/pokemon?limit=10")

    const cleanData  = data.results.map(async({name,url})=>{
      
      const segment  = url.split('/') 
    
     const pokemon = await this.pokemonModel.create({
      name,
      "no" : +segment[segment.length - 2]})
    })
   
   return 'Seed Executed'
  }
}
