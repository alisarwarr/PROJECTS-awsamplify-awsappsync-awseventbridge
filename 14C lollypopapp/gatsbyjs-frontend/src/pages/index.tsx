import React, { useState } from 'react';
import style from './index.module.scss';
//COMPONENTS
import Head from '../components/Head';
//SVG-COMPONENT
import Lollypop from '../components/Lollypop';
//MATERIAL-UI
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
//REACT-REVEAL
import Zoom from 'react-reveal/Zoom';
//SHORTID
import shortid from 'shortid';
//FORMIK & YUP
import { Formik, ErrorMessage } from 'formik';
import { object, string } from 'yup';
//GATSBY
import { navigate } from 'gatsby';
//AWS-AMPLIFY
import { API } from 'aws-amplify';
import { addLollypop } from '../graphql/mutations.js';

const process = (timeout: any) => new Promise(() => timeout);

export default function() {
    const [ topColor, setTopColor ] = useState<string>('#d52358');
    const [ middleColor, setMiddleColor ] = useState<string>('#e95946');
    const [ bottomColor, setBottomColor ] = useState<string>('#deaa43');

    const handleAdd = async ({ to, message, from, id }) => {//function need to be 'async' for process to create new page & naviagte
        await API.graphql({
            query: addLollypop,
            variables: {
                id,
                topColor,
                middleColor,
                bottomColor,
                to,
                message,
                from
            }
        })
    }

    return (
        <div className={style.body}>
            <Head
                title="Home"
            />
 
            <div className={style.root}>
                <Typography className={style.title}>
                    <Zoom left>
                        <p> 
                            <div className={style.fadeeffect}></div>
                            <ul>
                                <li>V</li> <li>i</li> <li>r</li> <li>t</li> <li>u</li> <li>a</li> <li>l</li>
                                <li style={{ marginLeft: "2rem" }}>L</li> <li>o</li> <li>l</li> <li>l</li> <li>y</li> <li>p</li> <li>o</li> <li>p</li>
                            </ul>
                            <small className="form-text">
                                because we all know someone who deserves some sugar!
                            </small>
                            <div className={style.fadeeffect}></div>
                        </p>
                    </Zoom>
                </Typography>

                <Zoom>
                    <div className={style.lollypop}>
                        <Lollypop
                            topColor={topColor}
                            middleColor={middleColor}
                            bottomColor={bottomColor}
                        />    
                        <div>
                            <input type="color" value={topColor} onChange={(e) => setTopColor(e.target.value)} className={style.first}
                            />
                            <input type="color" value={middleColor} onChange={(e) => setMiddleColor(e.target.value)}
                            />
                            <input type="color" value={bottomColor} onChange={(e) => setBottomColor(e.target.value)}
                            />
                        </div>
                    </div>
                </Zoom>

                <Zoom right>
                    <div className={style.div}>
                        <Formik
                            initialValues={{ to: '', message: '', from: '' }}
                            validationSchema={
                                object({
                                    to : string()
                                    .max(30, 'Must be atmost 30 character')
                                    .min(3, 'Must have atleast 3 characters')
                                    .required(`Must fill 'To'`),
                
                                    message: string()
                                    .max(50, 'Must be atmost 50 character')
                                    .min(5, 'Must have atleast 5 characters')
                                    .required(`Must fill 'From'`),
        
                                    from : string()
                                    .max(30, 'Must be atmost 30 character')
                                    .min(3, 'Must have atleast 3 characters')
                                    .required(`Must fill 'From'`),
                                })
                            }
                            onSubmit={async (values, { setSubmitting, resetForm }) => {
                                setSubmitting(true);

                              //creating unique pat here for same unique url saved to database & as well as opens
                                let id = shortid.generate();
                        
                                const willOccur = setTimeout(() => {
                                    resetForm();
                                    setSubmitting(false);
                                  //calling functions after 1.5 secs
                                    handleAdd({ ...values, id });
                                    navigate(`/oneLollypop/${id}`);
                                }, 1500);
                                
                                await process(willOccur);
                            }}
                        >
                            {({ values, handleChange, handleSubmit, isSubmitting }) => (
                                <form
                                    onSubmit={handleSubmit}            //formik's
                                    autoComplete="off"
                                >
                                    <div className="form-group">
                                        <label> to </label>
                                        <input
                                            name='to'
                                            value={values.to}          //formik's
                                            onChange={handleChange}    //formik's
                                            type="text"
                                            placeholder="A Lolly for . . ."
                                            className="form-control"
                                        />
                                        <ErrorMessage name='to' component="p" className={style.err}/>
                                    </div>
                                
                                    <div className="form-group">
                                        <label> say something nice </label>
                                        <input
                                            name='message'
                                            value={values.message}     //formik's
                                            onChange={handleChange}    //formik's
                                            type="text"
                                            placeholder="message . . ."
                                            className="form-control"
                                        />
                                        <ErrorMessage name='message' component="p" className={style.err}/>
                                    </div>
        
                                    <div className="form-group">
                                        <label> from </label>
                                        <textarea
                                            name='from'
                                            value={values.from}        //formik's
                                            onChange={handleChange}    //formik's
                                            className="form-control"
                                            placeholder="Your friend . . ."
                                            rows="3"
                                        />
                                        <ErrorMessage name='from' component="p" className={style.err}/>
                                    </div>
        
                                    <button type='submit' className="btn btn-danger btn-block shadow-none" disabled={isSubmitting}>
                                        SUBMIT { isSubmitting && <CircularProgress style={{ color: 'white', marginTop: "0.5rem", marginLeft: "0.4rem" }} size={15}/>}
                                    </button>
                                </form>
                            )}
                        </Formik>
                        <Typography className={style.text}>
                            Freeze this Lolly & get a link
                        </Typography>
                    </div>
                </Zoom>
            </div>
        </div>
    )
}