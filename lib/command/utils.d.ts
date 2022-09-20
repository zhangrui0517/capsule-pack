/// <reference types="node" />
import { templateType } from '../types';
import type { Stats } from 'fs-extra';
export declare function packageJsonGenerator(type: templateType, callback?: (stat: Stats) => void): void;
export declare function copyCpackTemplate(type: templateType, callback: () => void): void;
