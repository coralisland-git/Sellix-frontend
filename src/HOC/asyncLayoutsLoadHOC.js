import React, {Component} from "react";
import { LoaderFullscreen } from "../components";

export default function asyncLayoutsLoadHOC(importComponent) {
	class AsyncComponent extends Component {
		constructor(props) {
			super(props);

			this.state = {
				component: null
			};
		}

		async componentDidMount() {
			const { default: component } = await importComponent();

			this.setState({
				component: component
			});
		}

		render() {
			const C = this.state.component;

			return C ? <C {...this.props} /> : <LoaderFullscreen alwaysLoading={true} />;
		}
	}

	return AsyncComponent;
}