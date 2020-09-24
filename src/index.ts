import 'reflect-metadata'
// import {createConnection} from "typeorm";
// import {User} from "./entity/User";
require('dotenv').config()
import { startApolloServer } from './startApolloServer'
startApolloServer()
