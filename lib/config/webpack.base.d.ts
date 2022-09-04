import { Configuration } from "webpack";
import { CustomExtraConfig } from '../types';
declare function getBaseConfig(extraConfig?: CustomExtraConfig): Configuration;
export default getBaseConfig;
