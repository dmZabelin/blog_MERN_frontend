import React, { useEffect, useRef, useState } from 'react';
import styles from './Cabinet.module.scss';
import { Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, selectIsAuth } from '../../redux/slices/auth';
import { ReactComponent as Edit } from '../../assets/img/pencil-solid.svg';
import { createPortal } from 'react-dom';
import axios from '../../axios';
import Button from '@mui/material/Button';
import uploadImage from '../../common/uploadImage';
import { format } from 'date-fns';
import { Modal } from '../../components/Modal';

const inputHidden = {
	userName: true,
	userEmail: true
};

export const Cabinet = () => {
	const dispatch = useDispatch();
	const isAuth = useSelector(selectIsAuth);
	const [rect, setRect] = useState();
	const refMain = useRef(null);
	const refAvatar = useRef(null);
	const inputNameRef = useRef(null);
	const inputFileRef = useRef(null);
	const [isEdit, setIsEdit] = useState(true);
	const [userData, setUserData] = useState({});
	const [isVisible, setIsVisible] = useState(inputHidden);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		setRect(refAvatar.current.getBoundingClientRect());
		window.addEventListener('resize', () => {
			setRect(refAvatar.current.getBoundingClientRect());
		});
		dispatch(fetchAuthMe()).then((res) => {
			setUserData({ ...res.payload });
		});
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	const handleChangeFile = async (e) => {
		uploadImage(e.target.files[0]).then((res) => {
			setUserData({
				...userData,
				avatarUrl: `http://localhost:4444${res.data.url}`
			});
			setIsEdit(false);
		});
	};

	if (!window.localStorage.getItem('token') && !isAuth) {
		return <Navigate to="/" />;
	}

	async function handleSubmit() {
		axios.patch('/edit-profile', userData).then(() => {
			setIsEdit(true);
			setIsVisible(inputHidden);
		});
	}

	const handleChange = (e) => {
		setIsEdit(false);
		switch (e.target.name) {
			case 'userName':
				setUserData({ ...userData, fullName: e.target.value });
				break;
			case 'userEmail':
				setUserData({ ...userData, email: e.target.value });
				break;
			default:
				setUserData({});
				break;
		}
	};

	return (
		<>
			<div className={styles.personal} ref={refMain}>
				<div>
					<div className={styles.avatar} ref={refAvatar}>
						<img src={userData.avatarUrl || '/noavatar.png'} alt={userData.fullName} />
						{rect &&
							createPortal(
								<button
									onClick={() => inputFileRef.current.click()}
									className={styles.edit_avatar}
									style={{
										top: Math.round(rect?.top + rect?.height - 40),
										left: Math.round(rect?.left + rect?.width - 60)
									}}
								>
									<Edit />
								</button>,
								refMain.current
							)}
						<input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
					</div>
					<button className={styles.pwBtn} onClick={() => setIsOpen(true)}>
						change password
					</button>
				</div>
				<div className={styles.info}>
					<div className={styles.name}>
						<p>Full Name:</p>
						<p>
							<span hidden={!isVisible.userName}>{userData.fullName}</span>
							<input
								ref={inputNameRef}
								name="userName"
								type="text"
								value={userData.fullName ? userData.fullName : ''}
								onChange={handleChange}
								hidden={isVisible.userName}
							/>
						</p>
						<button onClick={() => setIsVisible({ ...isVisible, userName: false })} className={styles.edit}>
							<Edit />
						</button>
					</div>
					<div className={styles.email}>
						<p>E-mail:</p>
						<p>
							<span hidden={!isVisible.userEmail}>{userData.email}</span>
							<input
								name="userEmail"
								type="email"
								value={userData.email ? userData.email : ''}
								onChange={handleChange}
								hidden={isVisible.userEmail}
							/>
						</p>
						<button onClick={() => setIsVisible({ ...isVisible, userEmail: false })} className={styles.edit}>
							<Edit />
						</button>
					</div>
					<div className={styles.created}>
						<p>Account Created:</p>
						<p>
							<span>{userData.createdAt && format(new Date(userData.createdAt.split('t')[0]), 'yyyy/dd/MM')}</span>
						</p>
					</div>
				</div>
			</div>
			<div className={styles.submitBtn}>
				<Button disabled={isEdit} onClick={handleSubmit} size="large" variant="contained">
					Save
				</Button>
				<Button disabled={isEdit} size="large">
					Cancel
				</Button>
			</div>
			{isOpen && <Modal setIsOpen={setIsOpen} />}
		</>
	);
};
