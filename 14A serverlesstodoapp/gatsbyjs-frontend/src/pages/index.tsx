import React, { useState, useEffect } from 'react';
import style from './index.module.scss';
import classnames from 'classnames';
//MATERIAL-UI
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import useMediaQuery from '@material-ui/core/useMediaQuery';
//SWEETALERT2
import Swal from 'sweetalert2';
//COMPONENT
import Heading from '../components/Heading';
import Loading from '../components/Loading';
import ReadModal from '../components/ReadModal';
import Head from '../components/Head';
//AWS-AMPLIFY
import { API } from 'aws-amplify';
import { allTodos } from '../graphql/queries.js';
import { createTodo, deleteTodo, updateTodo } from '../graphql/mutations.js';
import { onCreateTodo, onDeleteTodo, onUpdateTodo } from '../graphql/subscriptions.js';

const truncate = (str: string, n: number) => str?.length > n ? `${str.substr(0, n-1)}` : str;

export default function() {
    const [ allTodo, setAllTodo ] = useState([]);

    const [ input, setInput ] = useState<string>('');
    const [ currentId, setCurrentId ] = useState<string>('');
    const [ processUpdating, setProcessUpdating ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);
    
    const fetchAll = async() => {
        const { data } = await API.graphql({ query: allTodos });
        setAllTodo(data.allTodos);
        setLoading(false);
    }

    const handleCreate = async(lastId) => {
        if(input === '') {
            Swal.fire({
                icon: 'warning',
                title: '<p id="design">Cancelled</p>',
                text: `Message can't be blank!`,
                confirmButtonText: 'Retry'
            })
        }
        else {
            await API.graphql(
                {
                    query: createTodo,
                    variables: {
                        id: ++lastId,                                    //assigned 'id'
                        detail: input                                    //assigned 'text'    
                    }
                }
            )
        }
    }

    const handleDelete = async(thatId) => {
        await API.graphql(
            {
                query: deleteTodo,
                variables: {
                    id: thatId                                           //assigned 'id'
                }
            }
        )
    }

    const handleUpdate = async(thatId, thatText) => {
        if(input === '') {
            Swal.fire({
                icon: 'warning',
                title: '<p id="design">Cancelled</p>',
                text: `Message can't be blank!`,
                confirmButtonText: 'Retry'
            })
        }
        else {
            await API.graphql(
                {
                    query: updateTodo,
                    variables: {
                        id: thatId,                                      //assigned 'id'
                        detail: thatText                                 //assigned 'text    
                    }
                }
            )
        }
    }

    const processUpdate = (thatId, thatText) => {
        setProcessUpdating(true);
        setInput(thatText);
        setCurrentId(thatId);
    }

    useEffect(() => {
        //fetching for first time
        fetchAll();
        //'subscription' for first time
        API.graphql({ query: onCreateTodo })
        .subscribe({
            next: () => { fetchAll(); }
        });    
        //'subscription' for first time
        API.graphql({ query: onDeleteTodo })
        .subscribe({
            next: () => { fetchAll(); }
        });
        //'subscription' for first time
        API.graphql({ query: onUpdateTodo })
        .subscribe({
            next: () => { fetchAll(); }
        });
    }, []);

    const screen250 = useMediaQuery('(max-width:250px)');
    allTodo && allTodo.sort((a, b) => (a.id > b.id) ? 1 : -1);           //sorting array by 'id'

    if(loading) return (
        <>
            <Head
            />

            <div className={style.root}>
                <Heading
                />
                
                <Card className={classnames(style.card, "bg-light")} square raised>
                    <Loading
                        sentence="Loading"
                    />

                    <div className={style.body}>
                        <div className="form-group">
                            <textarea disabled autoFocus onChange={(e) => setInput(e.target.value)} value={input} className="form-control" id="exampleFormControlTextarea1" rows="6" className="form-control" placeholder="Enter a word . . ."></textarea>
                        </div>
    
                        <div className={style.btn}>
                            <Button disabled style={{ backgroundColor: '#f50057', color: 'white' }} color="secondary" variant="contained" fullWidth size={screen250 ? "small" : "medium"}>
                                PLEASE WAIT
                                <div className="spinner-border text-light spinner-border-sm" role="status" style={{ marginLeft: 4, margintop: -8 }}>
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </Button>
                        </div>
                    </div>
               </Card>
            </div>
        </>
    )
    
    return (
        <>
            <Head
            />

            <div className={style.root}>
                <Heading
                />
    
                <Card className={classnames(style.card, "bg-light")} square raised>
                    {
                        (allTodo.length !== 0) && (
                            <div className={style.base}>
                                <div className="form-group">
                                    <label htmlFor="exampleFormControlTextarea1">
                                        <h4> <span className="badge badge-warning badge-pill"> Todos </span> </h4>
                                    </label>
                                </div>
    
                                <table className="table table-borderless table-dark table-sm">
                                    <thead>
                                        {
                                            <tr>
                                                <th> # </th>
                                                <th> TODO </th>
                                                <th> EDIT </th>
                                                <th> REMOVE </th>
                                            </tr>
                                        }
                                    </thead>
                                    <tbody>
                                        {
                                            allTodo.map((obj, i) => (
                                                <tr key={obj.id}>
                                                    <th> {i + 1} </th>
                                                    {obj.detail.length < 10 ? <th className={style.text}> <span> {obj.detail} </span> </th> : <th className={style.text}> <span> { truncate(obj.detail, 25)} <ReadModal title={obj.id} notes={obj.detail}/> </span> </th>}
                                                    <th> <IconButton onClick={() => processUpdate(obj.id, obj.detail) } color="inherit" size="small"> <EditIcon fontSize="small" style={{ color: 'golden' }}/> </IconButton> </th>
                                                    <th> <IconButton onClick={() => handleDelete(obj.id)} color="inherit" size="small"> <DeleteIcon fontSize="small" style={{ color: 'golden' }}/> </IconButton> </th>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        )
                    }
    
                    <div className={style.body}>
                        <div className="form-group">
                            <textarea autoFocus onChange={(e) => setInput(e.target.value)} value={input} className="form-control" id="exampleFormControlTextarea1" rows="6" className="form-control" placeholder="Enter a word . . ."></textarea>
                        </div>
    
                        <div className={style.btn}>
                            {/* sends one increase in last element's 'id' for new upcoming element's 'id' OR if it is first element then it's id is after 0 */}
                            <Button onClick={!processUpdating ? () => handleCreate((allTodo[allTodo.length-1]?.id) || 0) : () => handleUpdate(currentId, input)} color="secondary" variant="contained" fullWidth size={screen250 ? "small" : "medium"}>
                                {!processUpdating ? `NEW MESSAGE` : `EDIT MESSAGE`}
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    )
}