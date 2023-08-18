import { validationResult } from 'express-validator';
import {UserService} from '../repository/index.js'
import { PersonService } from '../repository/index.js';
import { comparePassword, hashPassword } from '../utils/hashedPass.js';

export const createUser = async(req,res,next) => { 
    const {errors} = validationResult(req)
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'failed',
            payload: errors
        })
    }
    const personInfo = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        birth_date: req.body.birth_date,
        address: req.body.address,
        phone_number: req.body.phone_number,
        dni: req.body.dni,
        gender_id: req.body.gender_id
    }
    const userInfo = {
        email: req.body.email,
        password: req.body.password,
        role_id: req.body.role_id,
        person_id: null
    }
    try {
        const {insertId} = await PersonService.createPerson(personInfo)
        const hashedPass = hashPassword(userInfo.password)
        userInfo.person_id = insertId
        userInfo.password = hashedPass
        const data = await UserService.createUser(userInfo)
        return res.json({
            status: 'OK',
            payload: {user_id: data.insertId}
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            payload: {
                message:error.message,
                stack:error.stack
            }
        })
    }
 }

export const logIn = async(req,res,next) => {
    const {errors} = validationResult(req)
    if (errors.length > 0) {
        return res.status(400).json({
            status: 'failed',
            payload: errors
        })
    }
    try {    
        const data = await UserService.getUserByEmail(req.body.email)
        if(data.length === 0) {
            return res.status(400).json({
                status: 'failed',
                payload: {
                    message: 'User not registered'
                }
            })
        }
        if(!comparePassword(req.body.password, data[0].password)) {
            return res.status(401).json({
                status: 'failed',
                payload: {
                    message: 'Invalid password'
                }
            })
        }
        const {password, ...other} = data[0]
        res.json({
            status: 'OK',
            payload: other
        })
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            payload: {
                message:error.message,
                stack:error.stack
            }
        })
    }
    }
    
export const getAllUsers = async(req,res,next) => {
    console.log('controllers.getAllUsers hitted');
    try {
        const data = await UserService.getAllUsers()
        res.json({
            status: 'OK',
            payload: data[0]
        })
        
    } catch (error) {
        res.status(500).json({
            status: 'failed',
            payload: {
                message:error.message,
                stack:error.stack
            }
        })
    }
}