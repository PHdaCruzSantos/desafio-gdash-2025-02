import { HydratedDocument } from 'mongoose';
export type WeatherLogDocument = HydratedDocument<WeatherLog>;
export declare class WeatherLog {
    city: string;
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
    description: string;
    wind_speed: number;
    collected_at: number;
}
export declare const WeatherLogSchema: import("mongoose").Schema<WeatherLog, import("mongoose").Model<WeatherLog, any, any, any, import("mongoose").Document<unknown, any, WeatherLog, any, {}> & WeatherLog & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, WeatherLog, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<WeatherLog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<WeatherLog> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
