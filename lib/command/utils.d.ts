/// <reference types="node" />
import { Stats } from 'fs-extra';
import { templateType } from '../types';
export declare function packageJsonGenerator(type: templateType, callback?: (stat: Stats) => void): void;
export declare function copyCpackTemplate(type: templateType, callback: () => void): void;
