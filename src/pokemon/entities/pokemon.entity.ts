import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Pokemon extends Document {
  //mongo da por defecto un id unico a nivel mundial, por lo tanto no es necesario colocarlo aqui

  @Prop({
    unique: true,
    index: true,
  })
  name: string;
  @Prop({
    unique: true,
    index: true,
  })
  no: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
