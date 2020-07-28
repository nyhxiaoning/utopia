export type PreviewPanel = 'preview'

export type LeftMenuPanel =
  | 'navigator'
  | 'filebrowser'
  | 'dependencylist'
  | 'genericExternalResources'
  | 'googleFontsResources'
  | 'insertmenu'
  | 'projectsettings'

export type CenterPanel = 'canvas' | 'misccodeeditor'

export type InspectorPanel = 'inspector'

export type CodeEditorPanel = 'uicodeeditor'

export type EditorPanel =
  | LeftMenuPanel
  | CenterPanel
  | CodeEditorPanel
  | InspectorPanel
  | PreviewPanel

export type EditorPane = 'leftmenu' | 'center' | 'inspector' | 'preview' | 'rightmenu'

export function paneForPanel(panel: EditorPanel | null): EditorPane | null {
  switch (panel) {
    case null:
      return null
    case 'navigator':
      return 'leftmenu'
    case 'filebrowser':
      return 'leftmenu'
    case 'dependencylist':
      return 'leftmenu'
    case 'genericExternalResources':
      return 'leftmenu'
    case 'googleFontsResources':
      return 'leftmenu'
    case 'insertmenu':
      return 'rightmenu'
    case 'projectsettings':
      return 'leftmenu'
    case 'canvas':
      return 'center'
    case 'misccodeeditor':
      return 'center'
    case 'inspector':
      return 'rightmenu'
    case 'uicodeeditor':
      return 'center'
    case 'preview':
      return 'preview'
    default:
      const _exhaustiveCheck: never = panel
      throw new Error(`Unhandled panel ${panel}`)
  }
}

export interface SetFocus {
  action: 'SET_FOCUS'
  focusedPanel: EditorPanel | null
}

export function setFocus(panel: EditorPanel | null): SetFocus {
  return {
    action: 'SET_FOCUS',
    focusedPanel: panel,
  }
}

export type ResizeLeftPane = {
  action: 'RESIZE_LEFTPANE'
  deltaPaneWidth: number
}

export function resizeLeftPane(deltaPaneWidth: number): ResizeLeftPane {
  return {
    action: 'RESIZE_LEFTPANE',
    deltaPaneWidth: deltaPaneWidth,
  }
}
