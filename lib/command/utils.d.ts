import type { templateType, projectInquirerAnswers } from '../types';
export declare function packageJsonGenerator(config: projectInquirerAnswers, callback?: () => void): void;
export declare function copyCpackTemplate(type: templateType, callback: () => void): void;
export declare function removePackageLock(packageManager: projectInquirerAnswers['packageManager']): void;
