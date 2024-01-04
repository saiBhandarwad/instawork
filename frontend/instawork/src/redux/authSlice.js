import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { decodeToken } from 'react-jwt'
const initialState = {
    allWorks: [],
    savedJobs: [],
    myJobs: [],
    allCities: [],
    allWorkTypes: [],
    user: null,
    loading: true,
    isLoggedIn: false,
    showNotify: false,
    notify: {
        status: false,
        message: ""
    }
};
export const getAllCityAndWorks = createAsyncThunk(
    'user/getAllCityAndWorks',
    async (token) => {
        const response = await axios.post("https://instawork-backend.vercel.app/work/getAllCityAndWorks", {
            headers: { token }
        });
        return response.data
    }
)
export const getSavedJobs = createAsyncThunk(
    'user/getSavedJobs',
    async (token) => {
        const { email } = decodeToken(token)
        const response = await axios.post("https://instawork-backend.vercel.app/work/getSavedJobs", {
            data: { email },
            headers: { token }
        });
        response.data.savedJobs.forEach(elem => {
            elem.status = "saved"
        })
        return response.data
    }
)
export const getMyJobs = createAsyncThunk(
    'user/getMyJobs',
    async (token) => {
        const { email } = decodeToken(token)
        const resMyJobs = await axios.post("https://instawork-backend.vercel.app/work/getMyJobs", {
            data: { email },
            headers: { token }
        });
        const resSavedWorks = await axios.post("https://instawork-backend.vercel.app/work/getSavedJobs", {
            data: { email },
            headers: { token }
        });
        let myJobs = resMyJobs.data.myJobs
       //console.log({myJobs});
        let savedWorks = resSavedWorks.data.savedJobs
        const allWorks = myJobs.map(work => {
            savedWorks.map((savedWork) => {
                if (work._id === savedWork.id) {
                    work.status = "saved"
                }
            })
            return work
        })
        const payload = { success: resMyJobs.data.success, allWorks }
        return payload
    }
)
export const fetchAllWorks = createAsyncThunk(
    'user/fetchAllWorks',
    async (token) => {
        const { email } = decodeToken(token)
        const resWorks = await axios.post("https://instawork-backend.vercel.app/work/works", {
            headers: { token }
        });
        const resSavedWorks = await axios.post("https://instawork-backend.vercel.app/work/getSavedJobs", {
            data: { email },
            headers: { token }
        });

        let works = resWorks.data.works
        let savedWorks = resSavedWorks.data.savedJobs
        const allWorks = works.map(work => {
            savedWorks.map((savedWork) => {
                if (work._id === savedWork.id) {
                    work.status = "saved"
                }
            })
            return work
        })
        const payload = { success: resWorks.data.success, allWorks }
        return payload
    }
)
export const fetchFilteredWorks = createAsyncThunk(
    'user/fetchFilteredWorks',
    async ({ obj, sortBy, sortType, token, pathname }) => {
        const { email } = decodeToken(token)
        const response = await axios.post("https://instawork-backend.vercel.app/work/getWorksByFilter", {
            data: { filterOBJECT: obj, sortBy, type: sortType, pathname, email },
            headers: { token }
        })
        return response.data
    }
)
export const fetchUserAsync = createAsyncThunk(
    'user/fetchuser',
    async (token) => {
        const response = await axios.post("https://instawork-backend.vercel.app/user/validateUser", {
            data: { token }
        });
        // The value we return becomes the `fulfilled` action payload
        return response.data;
    }

);

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setIsLoggedIn: (state, action) => {
            state.isLoggedIn = action.payload;
        },
        setShowNotify: (state, action) => {
            state.showNotify = action.payload
        },
        setNotify: (state, action) => {
            state.notify = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserAsync.fulfilled, (state, action) => {
                if(action.payload.success){
                    state.user = action.payload.user
                }    
            })
            .addCase(fetchAllWorks.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.allWorks = action.payload.allWorks;
                } else {
                    state.allWorks = [];
                }
                state.loading = false
            })
            .addCase(fetchAllWorks.pending, (state) => {
                state.loading = true
            })
            .addCase(getAllCityAndWorks.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.allWorkTypes = action.payload.workTypeArray;
                    state.allCities = action.payload.cityArray;
                    state.loading = false
                }
            })
            .addCase(getAllCityAndWorks.pending, (state) => {
                state.loading = true
            })
            .addCase(getSavedJobs.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.savedJobs = action.payload.savedJobs;
                    //console.log({savedJobs : action.payload.savedJobs});
                    state.loading = false
                } else {
                    state.savedJobs = [];
                }
            })
            .addCase(getSavedJobs.pending, (state) => {
                state.loading = true
            })
            .addCase(getMyJobs.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state.myJobs = action.payload.allWorks;
                    state.loading = false
                }
            })
            .addCase(getMyJobs.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchFilteredWorks.fulfilled, (state, action) => {
                state.loading = false
                if (action.payload.success) {
                   //console.log(action.payload);
                    state.allWorks = action.payload.works;
                    if (action.payload.myJobs) {
                        state.myJobs = action.payload.myJobs
                    }
                    if (action.payload.savedJobs) {
                        state.savedJobs = action.payload.savedJobs.map(elem => {
                            elem.status = "saved"
                            return elem
                        })
                    }


                }
            })
            .addCase(fetchFilteredWorks.pending, (state) => {
                state.loading = true
            })
    },
})
export const { setIsLoggedIn, setShowNotify, setNotify } = authSlice.actions;

export const verifyUser = (state) => state.user.isUserLoggedIn;

export default authSlice.reducer;