import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

export function AppComponent() {
	return (
		<Router>
			<Switch>
				<Route path="/Hello/">
					Hello World
				</Route>
				<Route path="/">
				</Route>
			</Switch>
		</Router>
	);
}
