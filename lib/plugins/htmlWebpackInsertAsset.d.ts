export declare type Options = Array<{
    tag: 'meta' | 'script' | 'link';
    attributes: {
        src: string;
    } & Record<string, any>;
    position?: 'before' | 'after';
}>;
export declare type TagToAssetTagsMap = {
    script: 'scripts';
    link: 'styles';
    meta: 'meta';
};
