import { Prop, Schema } from '@nestjs/mongoose';
export class Address {
  @Prop({
    type: Object,  
    index: true,
})
  country: object;

  @Prop({
    type: Object,
    index: true,
  })
  state: object;

  @Prop({ index: true })
  city: string;

  @Prop()
  pincode: string;

  @Prop()
  addressLine1: string;

  @Prop()
  addressLine2: string;

  @Prop()
  addressLine3: string;

  @Prop()
  phone: string;

  @Prop()
  website: string;
}

export class Country {
  @Prop()
  _id: string;

  @Prop()
  name: string;
}