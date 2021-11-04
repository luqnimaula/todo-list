import React, {memo} from "react";
import {LoadingOutlined} from '@ant-design/icons';

const FallbackContent = () => (
	<div className="todo-w-100 todo-h-100 todo-text-center todo-mt-5" style={{verticalAlign: 'middle'}}>
        <LoadingOutlined className="todo-fs-icon-lg"/>
    </div>
);

export default memo(FallbackContent);