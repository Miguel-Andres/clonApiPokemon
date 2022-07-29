import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
    this.handleExceptions(error)
    }
  }

  findAll() {
    return 'pokemon';
  }

  async findOne(id: string) {
    let pokemon: Pokemon;
    //si no es numero
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ no: id });
    }
    // //MOngoId
    if (!pokemon && isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id);
    }

    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: id.toLowerCase().trim(),
      });
    }

    //erorr
    if (!pokemon)
      throw new NotFoundException(
        `pokemon whit id , name , no '${id} not found `,
      );

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
     this.handleExceptions(error)
    }
  }

  async remove(id: string) {

   const {deletedCount}= await this.pokemonModel.deleteOne({_id : id})
      if(deletedCount === 0)
      throw new BadRequestException(`Pokemon whit id "${id} not found"`)

      
    return ;
  }


    private handleExceptions( error : any ){
      if (error.code === 11000)
        throw new BadRequestException(`this pokemon exist ${JSON.stringify( error.keyValue)}`);
      throw new InternalServerErrorException(
        `cant create Pokemon - check server logs`,
      );
    }
}
