import { StackActions, DrawerActions, CommonActions  } from '@react-navigation/native'

let _navigator: any

function setTopLevelNavigator(r: any) {
  _navigator = r
}

function navigate(routeName: any, params: any) {
  _navigator.dispatch(
    CommonActions.navigate({
      name: routeName,
      params : params
    })
  )
}

function replace(routeName: string, params: string) {
  _navigator.dispatch(
    StackActions.replace({ name: routeName, params : params })
  )
}

function openDrawer() {
  _navigator.dispatch(DrawerActions.openDrawer())
}

function closeDrawer() {
  _navigator.dispatch(DrawerActions.closeDrawer())
}

function back() {
  _navigator.dispatch(CommonActions.goBack())
}


export default {
  navigate,
  setTopLevelNavigator,
  openDrawer,
  closeDrawer,
  back,
  replace
}