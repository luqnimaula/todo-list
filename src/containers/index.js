import React, {memo} from "react";
import InfoView from "@app/components/InfoView";
import Routes from "@routes";

const AppHeader = memo(() => (
	<div className="todo-header" data-cy="header-background">
		<div className="todo-container">
			<h2 data-cy="header-title"
			className="todo-wrapper-container todo-header-title">
				TO DO LIST APP
			</h2>
		</div>
	</div>
));

export default memo(({match}) =>
{
	return (
		<div className="todo-w-100">
			<AppHeader/>
			<div className="todo-w-100 todo-wrapper-container">
				<Routes match={match}/>
			</div>
			<InfoView/>
        </div>
	)
});