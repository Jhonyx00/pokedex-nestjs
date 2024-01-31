import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {
  constructor(
    //this is what nest team did to inject models into our service
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
  ) {}

  //insertions are asyncronous
  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase(); //rewrite this property to lowercase

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto); //insertion
      return pokemon;
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  findAll() {
    const pokemons = this.pokemonModel.find();
    return pokemons;
  }

  async findOne(term: string) {
    let pokemon: Pokemon;

    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    //mongo id
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term);
    }

    //name

    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim(),
      });
    }

    if (!pokemon) {
      throw new NotFoundException(
        `Pokemon with name, id or no "${term}" not found`,
      );
    }
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);

    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }

    // try to update a pokemon, but if it is a number that already exists in db return an error
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions(error);
    }
    // ...pokemon.toJSON(), spread own properties

    //
  }

  async remove(id: string) {
    //ig the below function finds a pokemon, continue with removing in the next line, if not, throw an error
    //const pokemon = await this.findOne(id);
    //await pokemon.deleteOne();
    // this.pokemonModel.findByIdAndDelete(id) only with id
    const result = this.pokemonModel.findByIdAndDelete(id);

    return result;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists in db ${JSON.stringify(error.keyValue)}`,
      );
    }
    console.log(error);
    throw new InternalServerErrorException(
      `Can't create pokemon - Check server logs`,
    );
  }
}
