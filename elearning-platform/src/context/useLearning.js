import {useContext} from 'react';
import LearningContext from './LearningContext';

export default function useLearning() {
    return useContext(LearningContext);
}
