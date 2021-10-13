import { TFile, TFolder } from 'obsidian';
import { atom } from 'recoil';
import { FolderTree, FolderFileCountMap } from 'utils/types';

export const view = atom({
    key: 'fileTreeViewState',
    default: 'folder',
});

export const activeFolderPath = atom({
    key: 'fileTreeActiveFolderPathState',
    default: '',
});

export const excludedFolders = atom({
    key: 'fileTreeExcludedFoldersState',
    default: [] as string[],
});

export const excludedExtensions = atom({
    key: 'fileTreeExcludedExtensions',
    default: [] as string[],
});

export const folderFileCountMap = atom({
    key: 'fileTreeFolderFileCountMapState',
    default: {} as FolderFileCountMap,
});

export const folderTree = atom({
    key: 'fileTreeFolderTreeState',
    default: null as FolderTree,
    dangerouslyAllowMutability: true,
});

export const fileList = atom({
    key: 'fileTreeFileListState',
    default: [] as TFile[],
    dangerouslyAllowMutability: true,
});

export const pinnedFiles = atom({
    key: 'fileTreePinnedFilesState',
    default: [] as TFile[],
    dangerouslyAllowMutability: true,
});

export const openFolders = atom({
    key: 'fileTreeOpenFoldersState',
    default: [] as TFolder[],
    dangerouslyAllowMutability: true,
});

export const showSubFolders = atom({
    key: 'showSubFoldersInVault',
    default: false,
});
