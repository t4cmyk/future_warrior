import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import { Landing } from "./Landing";

export function AppComponent() {
	return (
		<Router>
			<Switch>
				<Route path="/Landing/">
					<Landing/>
				</Route>
				<Route path="/">
				</Route>
			</Switch>
		</Router>
	);
}
