import FileTreeAlternativePlugin from 'main';
import { stripIndents } from 'common-tags';
import dayjs from 'dayjs';
import { TFile, TFolder, App } from 'obsidian';
import { eventTypes, OZFile } from 'utils/types';

export const openFile = (props: { file: OZFile; app: App; newLeaf: boolean; leafBySplit?: boolean }) => {
    const { file, app, newLeaf, leafBySplit } = props;
    let fileToOpen = app.vault.getAbstractFileByPath(file.path);
    if (!fileToOpen) return;
    //分屏打开
    if(leafBySplit){
        let myLeaf = app.workspace.getLeaf(newLeaf);
        myLeaf = app.workspace.createLeafBySplit(myLeaf, 'vertical');
        app.workspace.setActiveLeaf(myLeaf, {
            focus: true,
        });
        myLeaf.openFile(fileToOpen as TFile, { eState: { focus: true } });
        return;
    }
    //优先激活已经存在的
    let result = false;
    app.workspace.iterateAllLeaves((leaf) => {
        const viewState = leaf.getViewState();
        if (viewState.state?.file === file.path) {
            app.workspace.setActiveLeaf(leaf);
            result = true;
        }
    });
    if (result) {
        return;
    }
    // If we have a "New Tab" tab open, just switch to that and let
    // 不存在已经打开的文件的情况下，优先以空tab打开文件
    const emptyLeaves = app.workspace.getLeavesOfType("empty");
    if (emptyLeaves.length > 0) {
        app.workspace.setActiveLeaf(emptyLeaves[0]);
        emptyLeaves[0].openFile(fileToOpen as TFile, { eState: { focus: true } });
        return;
    }
    //event.stopPropagation(); // This might break something...
    app.workspace.openLinkText(file.path, file.path, true);
    return;
};

export const getFileCreateString = (params: { plugin: FileTreeAlternativePlugin; fileName: string }): string => {
    const { plugin, fileName } = params;

    return stripIndents`
    ${
        plugin.settings.createdYaml
            ? `
        ---
        created: ${dayjs(new Date()).format('YYYY-MM-DD hh:mm:ss')}
        ---
        `
            : ''
    }
    ${plugin.settings.fileNameIsHeader ? `# ${fileName}` : ''}
    `;
};

export const createNewMarkdownFile = async (plugin: FileTreeAlternativePlugin, folder: TFolder, newFileName: string, content?: string) => {
    // @ts-ignore
    const newFile = await plugin.app.fileManager.createNewMarkdownFile(folder, newFileName);
    if (content && content !== '') await plugin.app.vault.modify(newFile, content);
    openFile({ file: newFile, app: plugin.app, newLeaf: false });
    let evt = new CustomEvent(eventTypes.activeFileChange, { detail: { filePath: newFile.path } });
    window.dispatchEvent(evt);
};

export const openFileInNewTab = (app: App, file: OZFile) => {
    openFile({ file: file, app: app, newLeaf: true });
};

export const openFileInNewTabGroup = (app: App, file: OZFile) => {
    openFile({ file: file, app: app, newLeaf: false, leafBySplit: true });
};
