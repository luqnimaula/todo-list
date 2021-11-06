import React, {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux"
import {hideMessage} from "@reduxActions/Common";
import {Modal, Icon} from "antd";
import $ from "jquery";

export default memo(() =>
{
    const dispatch = useDispatch();
    const errorMessage = useSelector(({common}) => common.error);
    const infoMessage = useSelector(({common}) => common.message);

    const [showInfo, setShowInfo] = useState(false);
    useEffect(() => {
        if (infoMessage)
        {
            setShowInfo(true);
            // Modal.info({
            //     title: <span data-cy="modal-information-title">{infoMessage}</span>,
            //     icon: <Icon type="info-circle" data-cy="modal-information-icon"/>,
            //     className: 'modal-alert-information',
            //     maskClosable: true,
            //     transitionName: "",
            //     maskTransitionName: "",
            //     onCancel: () => {
            //         dispatch(hideMessage());
            //     }
            // });
            $('.ant-modal-confirm-btns').remove()
        }
    }, [infoMessage, dispatch]);

    const [showError, setShowError] = useState(false);
    useEffect(() => {
        if (errorMessage)
        {
            setShowError(true);
            // Modal.error({
            //     title: <span data-cy="modal-information-title">{errorMessage}</span>,
            //     icon: <Icon type="close-circle" data-cy="modal-information-icon"/>,
            //     className: 'modal-alert-information',
            //     maskClosable: true,
            //     transitionName: "",
            //     maskTransitionName: "",
            //     onCancel: () => {
            //         dispatch(hideMessage());
            //     }
            // });
            $('.ant-modal-confirm-btns').remove()
        }
    }, [errorMessage, dispatch]);

    setTimeout(() => {
        $('.modal-alert-information > .ant-modal-content').attr('data-cy', 'modal-information');
    }, 1);

    return (
        <React.Fragment>
            <Modal
            visible={showInfo}
            title=""
            closable={false}
            className="modal-alert-information"
            maskClosable
            transitionName=""
            maskTransitionName=""
            footer={null}
            onCancel={() => {
                dispatch(hideMessage());
                setShowInfo(false);
            }}>
                <Icon type="info-circle" className="todo-text-primary todo-mr-2 todo-fs-lg" data-cy="modal-information-icon"/>
                <span data-cy="modal-information-title">{infoMessage}</span>
            </Modal>
            <Modal
            visible={showError}
            title=""
            closable={false}
            className="modal-alert-information"
            maskClosable
            transitionName=""
            maskTransitionName=""
            footer={null}
            onCancel={() => {
                dispatch(hideMessage());
                setShowError(false);
            }}>
                <Icon type="close-circle" className="todo-text-danger todo-mr-2 todo-fs-lg" data-cy="modal-information-icon"/>
                <span data-cy="modal-information-title">{errorMessage}</span>
            </Modal>
        </React.Fragment>
    );
});