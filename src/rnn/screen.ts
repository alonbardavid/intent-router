import React, { ComponentType } from "react"
import { autorun } from "mobx"
import { ScreenType } from "../core/routes"
import { registerComponent } from "./integration"

function getNameFromComponent(component, screens: Map<string, any>) {
  let name = component.name
  if (screens.get(name)) {
    name = name + "#" + Math.floor(Math.random() * 10000)
  }
  return name
}
export class ScreenManager {
  namesByScreen = new Map<ScreenType, { screen: ScreenType; name: string }>()
  screenByName = new Map<string, { screen: ScreenType; name: string }>()
  navigator

  registerScreen(screen: ScreenType) {
    const name = getNameFromComponent(screen, this.screenByName)
    this.namesByScreen.set(screen, { screen, name })
    this.screenByName.set(name, { screen, name })
    registerComponent(name, WrapComponent(screen, this.setNavigator))
  }
  getScreenName = (screen: ScreenType): string => {
    return this.namesByScreen.get(screen).name
  }
  getScreenFromName(name: string) {
    return this.screenByName.get(name).screen
  }
  setNavigator = navigator => {
    this.navigator = navigator
  }
}

export function WrapComponent(Component, setNavigator) {
  return class WrappedComponent extends React.Component<any, any> {
    state
    dismissAutorun
    componentRef
    constructor(props = {} as any) {
      super(props)
      this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    }
    _resolveState(props) {
      const { _resolve, ...restProps } = props
      if (_resolve) {
        const resolved = _resolve()
        return { props: { ...restProps, ...resolved } }
      } else {
        return { props: restProps }
      }
    }
    onNavigatorEvent = event => {
      switch (event.id) {
        case "didAppear":
          setNavigator(this.props.navigator)
          this.componentRef.componentDidAppear &&
            this.componentRef.componentDidAppear()
        case "didDisappear":
          this.componentRef.componentDidDisappear &&
            this.componentRef.componentDidDisappear()
        case "bottomTabSelected":
          break
      }
    }
    componentWillMount() {
      let firstRun = true
      this.state = this._resolveState(this.props)
      this.dismissAutorun = autorun(() => {
        const newState = this._resolveState(this.props)
        if (!firstRun) {
          this.setState(newState)
        }
        firstRun = false
      })
    }
    componentWillUnmount() {
      this.dismissAutorun && this.dismissAutorun()
    }
    render() {
      return React.createElement(Component, {
        ...this.state.props,
        ref: (ref: any) => (this.componentRef = ref)
      })
    }
  }
}
