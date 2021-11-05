import React, {memo, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link} from "react-router-dom";
import {Row, Col, Modal, Icon} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import {createTodo, deleteTodo, getTodo} from "@reduxActions/Todo";
import moment from "moment";
import "moment/locale/id";

const ActivityItem = memo(({data}) =>
{
	const {id, title, created_at} = data;
	return (
		<div data-cy="activity-item"
		className="todo-card todo-w-100">
			<Link to={`/detail/${id}`}>
				<div className="todo-card-body">
					<h4 data-cy="activity-item-title"
					className="todo-card-item-title todo-mt-0">
						{title}
					</h4>
				</div>
			</Link>
			<div className="todo-d-flex todo-justify-content-between">
				<div className="todo-text-muted todo-fs-md" data-cy="activity-item-date">
					{created_at ? moment(created_at).format('LL') : '-'}
				</div>
				<div className="todo-text-muted todo-fs-md">
					<ActivityDelete {...data}/>
				</div>
			</div>
		</div>
	)
});

const ActivityDelete = memo(({id, title}) =>
{
	const dispatch = useDispatch();
	const [show, setShow] = useState(false);
	const [deleting, setDeleting] = useState(false);

	const handleShow = () => setShow((show) => !show);
	const onDelete = () =>
	{
		handleShow();
		setDeleting(true);
		dispatch(deleteTodo(id, () => setDeleting(false)));
	}

	return (
		<React.Fragment>
			{deleting ? <LoadingOutlined className="todo-fs-xl"/> : (
				<span className="todo-icon-trash todo-pointer"
				data-cy="activity-item-delete-button"
				onClick={handleShow}/>
			)}
			<Modal
			title=""
			footer={null}
			visible={show}
			closable={false}
			onCancel={handleShow}>
				<div
				className="todo-w-100 todo-text-center"
				data-cy="modal-delete">
					<Icon
					type="warning"
					className="todo-text-danger todo-fs-iconcard"
					data-cy="modal-delete-icon"/>
					<h3 className="todo-my-4"
					data-cy="modal-delete-title">
						Apakah anda yakin ingin menghapus activity <span className="todo-font-weight-semi-bold">"{title}"</span> ?
					</h3>
					<button
					className="todo-btn todo-mr-2"
					onClick={handleShow}
					data-cy="modal-delete-cancel-button">
						Batal
					</button>
					<button
					className="todo-btn todo-btn-danger"
					onClick={onDelete}
					data-cy="modal-delete-confirm-button">
						Hapus
					</button>
				</div>
			</Modal>
		</React.Fragment>
	)
});

export default memo(() => 
{
	moment.locale('id');
	const dispatch = useDispatch();
	const {loading, data} = useSelector(({todo}) => todo);

	useEffect(() => {
		dispatch(getTodo());
	}, [dispatch]);

	const [adding, setAdding] = useState(false);
	const onCreateTodo = () =>
	{
		setAdding(true);
		dispatch(createTodo(() => setAdding(false)));
	}

	return (
		<div className="todo-w-100">
			<div className="todo-d-flex todo-justify-content-between todo-my-4 todo-align-items-center">
				<h1 className="todo-my-0 todo-font-weight-semi-bold"
				data-cy="activity-title">
					Activity
				</h1>
				<div>
					<button
					data-cy="activity-add-button"
					className="todo-btn todo-btn-primary"
					onClick={onCreateTodo}
					disabled={adding}>
						{adding ? <LoadingOutlined className="todo-text-white todo-fs-xl"/> : (
							<React.Fragment>
								<span className="todo-icon-plus todo-mr-2"/>
								Tambah
							</React.Fragment>
						)}
					</button>
				</div>
			</div>
			{loading ? (
				<div className="todo-w-100 todo-text-center">
					<LoadingOutlined className="todo-fs-icon-lg todo-text-primary"/>
				</div>
			) : (
				<Row gutter={[8,8]}>
					{(data && data.length) ? data.map((row, index) => (
				        <Col xxl={6} xl={6} lg={6} md={8} sm={12} xs={24} key={index} className="todo-p-2">
				        	<ActivityItem data={row}/>
					    </Col>
					)) : (
						<Col span={24}>
							<div className="todo-w-100 todo-text-center todo-wrapper-container">
								<span className="todo-activity-empty"
								data-cy="activity-empty-state"/>
							</div>
					    </Col>
					)}
				</Row>
			)}
		</div>
	)
});