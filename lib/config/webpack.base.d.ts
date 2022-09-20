import type { CustomExtraConfig } from '../types';
import type { Configuration } from 'webpack';
declare function getBaseConfig(extraConfig?: CustomExtraConfig): Configuration;
export default getBaseConfig;
