import { Configuration } from 'webpack';
import { CustomExtraConfig } from '../types';
export declare function polyfillInsert(extraConfig: CustomExtraConfig, config: Configuration): Configuration;
export declare function babelPresetGenerator(extraConfig: CustomExtraConfig): string[];
