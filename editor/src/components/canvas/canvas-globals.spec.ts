import { right } from '../../core/shared/either'
import {
  emptyComments,
  jsxAttributesEntry,
  jsxAttributeValue,
  jsxElementWithoutUID,
} from '../../core/shared/element-template'
import { importAlias, importDetails } from '../../core/shared/project-file-types'
import { DispatchPriority, EditorAction, EditorDispatch } from '../editor/action-types'
import {
  addRegisteredControls,
  ControlsToCheck,
  clearAllRegisteredControls,
  validateControlsToCheck,
} from './canvas-globals'
import {
  ComponentDescriptor,
  ComponentDescriptorWithName,
  PropertyControlsInfo,
} from '../custom-code/code-file'

const cardComponentDescriptor: ComponentDescriptor = {
  properties: right({
    title: right({
      control: 'string-input',
      label: 'Title',
    }),
  }),
  variants: [
    {
      insertMenuLabel: 'Card Default',
      elementToInsert: jsxElementWithoutUID(
        'Card',
        [jsxAttributesEntry('title', jsxAttributeValue('Default', emptyComments), emptyComments)],
        [],
      ),
      importsToAdd: {
        ['/src/card']: importDetails(null, [importAlias('Card')], null),
      },
    },
  ],
}

const cardComponentDescriptorWithName: ComponentDescriptorWithName = {
  ...cardComponentDescriptor,
  componentName: 'Card',
}

const cardControlsToCheck: ControlsToCheck = Promise.resolve(
  right([cardComponentDescriptorWithName]),
)

const cardPropertyControlsInfo: PropertyControlsInfo = {
  ['/src/card']: {
    Card: cardComponentDescriptor,
  },
}

const modifiedCardComponentDescriptor: ComponentDescriptor = {
  properties: right({
    title: right({
      control: 'string-input',
      label: 'Title',
    }),
    border: right({
      control: 'string-input',
      label: 'Border',
    }),
  }),
  variants: [
    {
      insertMenuLabel: 'Card Default',
      elementToInsert: jsxElementWithoutUID(
        'Card',
        [
          jsxAttributesEntry('title', jsxAttributeValue('Default', emptyComments), emptyComments),
          jsxAttributesEntry('border', jsxAttributeValue('shiny', emptyComments), emptyComments),
        ],
        [],
      ),
      importsToAdd: {
        ['/src/card']: importDetails(null, [importAlias('Card')], null),
      },
    },
  ],
}

const modifiedCardComponentDescriptorWithName: ComponentDescriptorWithName = {
  ...modifiedCardComponentDescriptor,
  componentName: 'Card',
}

const modifiedCardControlsToCheck: ControlsToCheck = Promise.resolve(
  right([modifiedCardComponentDescriptorWithName]),
)

const selectorComponentDescriptor: ComponentDescriptor = {
  properties: right({
    value: right({
      control: 'popuplist',
      label: 'Value',
      options: ['True', 'False', 'FileNotFound'],
    }),
  }),
  variants: [
    {
      insertMenuLabel: 'True False Selector',
      elementToInsert: jsxElementWithoutUID(
        'Selector',
        [
          jsxAttributesEntry(
            'value',
            jsxAttributeValue(`'FileNotFound'`, emptyComments),
            emptyComments,
          ),
        ],
        [],
      ),
      importsToAdd: {
        ['/src/selector']: importDetails(null, [importAlias('Selector')], null),
      },
    },
  ],
}

const selectorComponentDescriptorWithName: ComponentDescriptorWithName = {
  ...selectorComponentDescriptor,
  componentName: 'Selector',
}

const selectorControlsToCheck: ControlsToCheck = Promise.resolve(
  right([selectorComponentDescriptorWithName]),
)

const selectorPropertyControlsInfo: PropertyControlsInfo = {
  ['/src/selector']: {
    Selector: selectorComponentDescriptor,
  },
}

const otherCardComponentDescriptorWithName: ComponentDescriptorWithName = {
  ...cardComponentDescriptor,
  componentName: 'Other Card',
}

const otherCardControlsToCheck: ControlsToCheck = Promise.resolve(
  right([otherCardComponentDescriptorWithName]),
)

describe('validateControlsToCheck', () => {
  beforeEach(() => {
    clearAllRegisteredControls()
  })
  afterAll(() => {
    clearAllRegisteredControls()
  })
  it('does nothing if no controls are added', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    await validateControlsToCheck(dispatch, {}, [], [])
    expect(actionsDispatched).toMatchInlineSnapshot(`Array []`)
  })
  it('includes some controls added', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
    await validateControlsToCheck(dispatch, {}, ['test.js'], ['test.js'])
    expect(actionsDispatched).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "UPDATE_PROPERTY_CONTROLS_INFO",
          "moduleNamesOrPathsToDelete": Array [],
          "propertyControlsInfo": Object {
            "/src/card": Object {
              "Card": Object {
                "properties": Object {
                  "type": "RIGHT",
                  "value": Object {
                    "title": Object {
                      "type": "RIGHT",
                      "value": Object {
                        "control": "string-input",
                        "label": "Title",
                      },
                    },
                  },
                },
                "variants": Array [
                  Object {
                    "elementToInsert": Object {
                      "children": Array [],
                      "name": Object {
                        "baseVariable": "Card",
                        "propertyPath": Object {
                          "propertyElements": Array [],
                        },
                      },
                      "props": Array [
                        Object {
                          "comments": Object {
                            "leadingComments": Array [],
                            "trailingComments": Array [],
                          },
                          "key": "title",
                          "type": "JSX_ATTRIBUTES_ENTRY",
                          "value": Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "type": "ATTRIBUTE_VALUE",
                            "value": "Default",
                          },
                        },
                      ],
                    },
                    "importsToAdd": Object {
                      "/src/card": Object {
                        "importedAs": null,
                        "importedFromWithin": Array [
                          Object {
                            "alias": "Card",
                            "name": "Card",
                          },
                        ],
                        "importedWithName": null,
                      },
                    },
                    "insertMenuLabel": "Card Default",
                  },
                ],
              },
            },
          },
        },
      ]
    `)
  })
  it('deletes the controls removed from a file', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    // First add the controls
    addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
    await validateControlsToCheck(dispatch, {}, ['test.js'], ['test.js'])

    // Clear the captured actions because we only care about actions dispatched by the next call
    actionsDispatched = []

    // As the second "evaluation" of 'test.js' didn't register controls, controls registered by the previous
    // evaluation will be removed
    await validateControlsToCheck(dispatch, cardPropertyControlsInfo, ['test.js'], ['test.js'])
    expect(actionsDispatched).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "UPDATE_PROPERTY_CONTROLS_INFO",
          "moduleNamesOrPathsToDelete": Array [
            "/src/card",
          ],
          "propertyControlsInfo": Object {},
        },
      ]
    `)
  })
  it('deletes the controls no longer imported', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    // First add the controls
    addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
    await validateControlsToCheck(dispatch, {}, ['test.js'], ['test.js'])

    // Clear the captured actions because we only care about actions dispatched by the next call
    actionsDispatched = []

    // As 'test.js' is no longer imported, it removes the controls registered by 'test.js' previously
    await validateControlsToCheck(dispatch, cardPropertyControlsInfo, [], [])
    expect(actionsDispatched).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "UPDATE_PROPERTY_CONTROLS_INFO",
          "moduleNamesOrPathsToDelete": Array [
            "/src/card",
          ],
          "propertyControlsInfo": Object {},
        },
      ]
    `)
  })
  it('not evaluating a file will not remove the controls registered by it', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    // First add the controls
    addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
    await validateControlsToCheck(dispatch, {}, ['test.js'], ['test.js'])

    // Clear the captured actions because we only care about actions dispatched by the next call
    actionsDispatched = []

    // 'test.js' is still imported, but not evaluated this time
    await validateControlsToCheck(dispatch, cardPropertyControlsInfo, ['test.js'], [])
    expect(actionsDispatched).toMatchInlineSnapshot(`Array []`)
  }),
    it('importing a file, then removing that import, then adding it again will register the controls even if not evaluated', async () => {
      let actionsDispatched: Array<EditorAction> = []
      const dispatch: EditorDispatch = (
        actions: ReadonlyArray<EditorAction>,
        priority?: DispatchPriority,
      ) => {
        actionsDispatched.push(...actions)
      }
      // First add the controls
      addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
      await validateControlsToCheck(dispatch, {}, ['test.js'], ['test.js'])

      // As 'test.js' is no longer imported, it removes the controls registered by 'test.js' previously
      await validateControlsToCheck(dispatch, cardPropertyControlsInfo, [], [])

      // Clear the captured actions because we only care about actions dispatched by the next call
      actionsDispatched = []

      // 'test.js' is now imported again, but not evaluated this time as it hasn't changed
      await validateControlsToCheck(dispatch, {}, ['test.js'], [])

      expect(actionsDispatched).toMatchInlineSnapshot(`
        Array [
          Object {
            "action": "UPDATE_PROPERTY_CONTROLS_INFO",
            "moduleNamesOrPathsToDelete": Array [],
            "propertyControlsInfo": Object {
              "/src/card": Object {
                "Card": Object {
                  "properties": Object {
                    "type": "RIGHT",
                    "value": Object {
                      "title": Object {
                        "type": "RIGHT",
                        "value": Object {
                          "control": "string-input",
                          "label": "Title",
                        },
                      },
                    },
                  },
                  "variants": Array [
                    Object {
                      "elementToInsert": Object {
                        "children": Array [],
                        "name": Object {
                          "baseVariable": "Card",
                          "propertyPath": Object {
                            "propertyElements": Array [],
                          },
                        },
                        "props": Array [
                          Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "key": "title",
                            "type": "JSX_ATTRIBUTES_ENTRY",
                            "value": Object {
                              "comments": Object {
                                "leadingComments": Array [],
                                "trailingComments": Array [],
                              },
                              "type": "ATTRIBUTE_VALUE",
                              "value": "Default",
                            },
                          },
                        ],
                      },
                      "importsToAdd": Object {
                        "/src/card": Object {
                          "importedAs": null,
                          "importedFromWithin": Array [
                            Object {
                              "alias": "Card",
                              "name": "Card",
                            },
                          ],
                          "importedWithName": null,
                        },
                      },
                      "insertMenuLabel": "Card Default",
                    },
                  ],
                },
              },
            },
          },
        ]
      `)
    })
  it('includes newly added controls', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
    addRegisteredControls('test.js', '/src/selector', selectorControlsToCheck)
    await validateControlsToCheck(dispatch, cardPropertyControlsInfo, ['test.js'], ['test.js'])
    expect(actionsDispatched).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "UPDATE_PROPERTY_CONTROLS_INFO",
          "moduleNamesOrPathsToDelete": Array [],
          "propertyControlsInfo": Object {
            "/src/selector": Object {
              "Selector": Object {
                "properties": Object {
                  "type": "RIGHT",
                  "value": Object {
                    "value": Object {
                      "type": "RIGHT",
                      "value": Object {
                        "control": "popuplist",
                        "label": "Value",
                        "options": Array [
                          "True",
                          "False",
                          "FileNotFound",
                        ],
                      },
                    },
                  },
                },
                "variants": Array [
                  Object {
                    "elementToInsert": Object {
                      "children": Array [],
                      "name": Object {
                        "baseVariable": "Selector",
                        "propertyPath": Object {
                          "propertyElements": Array [],
                        },
                      },
                      "props": Array [
                        Object {
                          "comments": Object {
                            "leadingComments": Array [],
                            "trailingComments": Array [],
                          },
                          "key": "value",
                          "type": "JSX_ATTRIBUTES_ENTRY",
                          "value": Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "type": "ATTRIBUTE_VALUE",
                            "value": "'FileNotFound'",
                          },
                        },
                      ],
                    },
                    "importsToAdd": Object {
                      "/src/selector": Object {
                        "importedAs": null,
                        "importedFromWithin": Array [
                          Object {
                            "alias": "Selector",
                            "name": "Selector",
                          },
                        ],
                        "importedWithName": null,
                      },
                    },
                    "insertMenuLabel": "True False Selector",
                  },
                ],
              },
            },
          },
        },
      ]
    `)
  })
  it('includes modified controls', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    addRegisteredControls('test.js', '/src/card', modifiedCardControlsToCheck)
    addRegisteredControls('test.js', '/src/selector', selectorControlsToCheck)
    await validateControlsToCheck(
      dispatch,
      {
        ...cardPropertyControlsInfo,
        ...selectorPropertyControlsInfo,
      },
      ['test.js'],
      ['test.js'],
    )
    expect(actionsDispatched).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "UPDATE_PROPERTY_CONTROLS_INFO",
          "moduleNamesOrPathsToDelete": Array [],
          "propertyControlsInfo": Object {
            "/src/card": Object {
              "Card": Object {
                "properties": Object {
                  "type": "RIGHT",
                  "value": Object {
                    "border": Object {
                      "type": "RIGHT",
                      "value": Object {
                        "control": "string-input",
                        "label": "Border",
                      },
                    },
                    "title": Object {
                      "type": "RIGHT",
                      "value": Object {
                        "control": "string-input",
                        "label": "Title",
                      },
                    },
                  },
                },
                "variants": Array [
                  Object {
                    "elementToInsert": Object {
                      "children": Array [],
                      "name": Object {
                        "baseVariable": "Card",
                        "propertyPath": Object {
                          "propertyElements": Array [],
                        },
                      },
                      "props": Array [
                        Object {
                          "comments": Object {
                            "leadingComments": Array [],
                            "trailingComments": Array [],
                          },
                          "key": "title",
                          "type": "JSX_ATTRIBUTES_ENTRY",
                          "value": Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "type": "ATTRIBUTE_VALUE",
                            "value": "Default",
                          },
                        },
                        Object {
                          "comments": Object {
                            "leadingComments": Array [],
                            "trailingComments": Array [],
                          },
                          "key": "border",
                          "type": "JSX_ATTRIBUTES_ENTRY",
                          "value": Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "type": "ATTRIBUTE_VALUE",
                            "value": "shiny",
                          },
                        },
                      ],
                    },
                    "importsToAdd": Object {
                      "/src/card": Object {
                        "importedAs": null,
                        "importedFromWithin": Array [
                          Object {
                            "alias": "Card",
                            "name": "Card",
                          },
                        ],
                        "importedWithName": null,
                      },
                    },
                    "insertMenuLabel": "Card Default",
                  },
                ],
              },
            },
          },
        },
      ]
    `)
  })
  it('merges multiple calls for the same module', async () => {
    let actionsDispatched: Array<EditorAction> = []
    const dispatch: EditorDispatch = (
      actions: ReadonlyArray<EditorAction>,
      priority?: DispatchPriority,
    ) => {
      actionsDispatched.push(...actions)
    }
    addRegisteredControls('test.js', '/src/card', cardControlsToCheck)
    addRegisteredControls('test.js', '/src/card', otherCardControlsToCheck)
    await validateControlsToCheck(dispatch, {}, ['test.js'], ['test.js'])
    expect(actionsDispatched).toMatchInlineSnapshot(`
      Array [
        Object {
          "action": "UPDATE_PROPERTY_CONTROLS_INFO",
          "moduleNamesOrPathsToDelete": Array [],
          "propertyControlsInfo": Object {
            "/src/card": Object {
              "Card": Object {
                "properties": Object {
                  "type": "RIGHT",
                  "value": Object {
                    "title": Object {
                      "type": "RIGHT",
                      "value": Object {
                        "control": "string-input",
                        "label": "Title",
                      },
                    },
                  },
                },
                "variants": Array [
                  Object {
                    "elementToInsert": Object {
                      "children": Array [],
                      "name": Object {
                        "baseVariable": "Card",
                        "propertyPath": Object {
                          "propertyElements": Array [],
                        },
                      },
                      "props": Array [
                        Object {
                          "comments": Object {
                            "leadingComments": Array [],
                            "trailingComments": Array [],
                          },
                          "key": "title",
                          "type": "JSX_ATTRIBUTES_ENTRY",
                          "value": Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "type": "ATTRIBUTE_VALUE",
                            "value": "Default",
                          },
                        },
                      ],
                    },
                    "importsToAdd": Object {
                      "/src/card": Object {
                        "importedAs": null,
                        "importedFromWithin": Array [
                          Object {
                            "alias": "Card",
                            "name": "Card",
                          },
                        ],
                        "importedWithName": null,
                      },
                    },
                    "insertMenuLabel": "Card Default",
                  },
                ],
              },
              "Other Card": Object {
                "properties": Object {
                  "type": "RIGHT",
                  "value": Object {
                    "title": Object {
                      "type": "RIGHT",
                      "value": Object {
                        "control": "string-input",
                        "label": "Title",
                      },
                    },
                  },
                },
                "variants": Array [
                  Object {
                    "elementToInsert": Object {
                      "children": Array [],
                      "name": Object {
                        "baseVariable": "Card",
                        "propertyPath": Object {
                          "propertyElements": Array [],
                        },
                      },
                      "props": Array [
                        Object {
                          "comments": Object {
                            "leadingComments": Array [],
                            "trailingComments": Array [],
                          },
                          "key": "title",
                          "type": "JSX_ATTRIBUTES_ENTRY",
                          "value": Object {
                            "comments": Object {
                              "leadingComments": Array [],
                              "trailingComments": Array [],
                            },
                            "type": "ATTRIBUTE_VALUE",
                            "value": "Default",
                          },
                        },
                      ],
                    },
                    "importsToAdd": Object {
                      "/src/card": Object {
                        "importedAs": null,
                        "importedFromWithin": Array [
                          Object {
                            "alias": "Card",
                            "name": "Card",
                          },
                        ],
                        "importedWithName": null,
                      },
                    },
                    "insertMenuLabel": "Card Default",
                  },
                ],
              },
            },
          },
        },
      ]
    `)
  })
})
