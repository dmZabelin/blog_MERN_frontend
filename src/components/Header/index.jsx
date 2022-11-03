import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/auth';

export const Header = () => {
	const dispatch = useDispatch();
	const { data, status } = useSelector((state) => state.auth);
	const isAuth = Boolean(data);

	const onClickLogout = () => {
		if (window.confirm('Are you sure?')) {
			dispatch(logout());
			window.localStorage.removeItem('token');
		}
	};

	return (
		<div className={styles.root}>
			<Container maxWidth="lg">
				<div className={styles.inner}>
					<Link className={styles.logo} to="/">
						<div>DM BLOG</div>
					</Link>
					<div className={styles.buttons}>
						{status !== 'loading' ? (
							isAuth ? (
								<>
									<Link to="/add-post">
										<Button variant="contained">Write article</Button>
									</Link>
									<Link
										to="/cabinet"
										state={{
											data
										}}
									>
										<Button variant="contained" color="success">
											Personal cabinet
										</Button>
									</Link>
									<Button onClick={onClickLogout} variant="contained" color="error">
										Log out
									</Button>
								</>
							) : (
								<>
									<Link to="/login">
										<Button variant="outlined">Log in</Button>
									</Link>
									<Link to="/signup">
										<Button variant="contained">Create account</Button>
									</Link>
								</>
							)
						) : null}
					</div>
				</div>
			</Container>
		</div>
	);
};
