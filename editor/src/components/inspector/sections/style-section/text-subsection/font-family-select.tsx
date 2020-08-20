import * as React from 'react'
import { betterReactMemo } from 'uuiui-deps'
import { identity } from '../../../../../core/shared/utils'
import utils from '../../../../../utils/utils'
import { FlexRow, Icons, UtopiaTheme } from '../../../../../uuiui'
import { InspectorContextMenuWrapper } from '../../../../context-menu-wrapper'
import { addOnUnsetValues } from '../../../common/context-menu-items'
import { stylePropPathMappingFn, useInspectorInfo } from '../../../common/property-path-hooks'
import { PropertyRow } from '../../../widgets/property-row'
import { FontFamilySelectPopup } from './font-family-select-popup'

export const FontFamilySelect = betterReactMemo('FontFamilySelect', () => {
  const [popupIsOpen, setPopupIsOpen] = React.useState(false)
  const togglePopup = React.useCallback(() => setPopupIsOpen((v) => !v), [])
  const closePopup = React.useCallback(() => setPopupIsOpen(false), [])

  const onMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      togglePopup()
      e.stopPropagation()
    },
    [togglePopup],
  )

  const { value, useSubmitValueFactory, onUnsetValues, controlStyles } = useInspectorInfo(
    ['fontFamily', 'fontStyle', 'fontWeight'],
    identity,
    identity,
    stylePropPathMappingFn,
  )

  const fontFamilyContextMenuItems = utils.stripNulls([
    controlStyles.unsettable ? addOnUnsetValues(['fontFamily'], onUnsetValues) : null,
  ])

  return (
    <PropertyRow>
      <InspectorContextMenuWrapper
        id='fontFamily-context-menu'
        items={fontFamilyContextMenuItems}
        data={null}
        style={{ marginBottom: 8, gridColumn: '1 / span 6' }}
      >
        {popupIsOpen ? (
          <FontFamilySelectPopup
            value={value}
            onUnsetValues={onUnsetValues}
            controlStyles={controlStyles}
            closePopup={closePopup}
            useSubmitValueFactory={useSubmitValueFactory}
          />
        ) : null}
        <FlexRow
          onMouseDownCapture={onMouseDown}
          style={{
            boxShadow: `0 0 0 1px ${controlStyles.borderColor} inset`,
            padding: 4,
            fontSize: 14,
            height: 30,
            borderRadius: UtopiaTheme.inputBorderRadius,
          }}
        >
          <div style={{ flexGrow: 1 }}>{value.fontFamily[0]}</div>
          <Icons.ExpansionArrowDown />
        </FlexRow>
      </InspectorContextMenuWrapper>
    </PropertyRow>
  )
})