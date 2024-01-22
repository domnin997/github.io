import DictionaryPlaceholder from '../../components/dictionaryPlaceholder/dictionaryPlaceholder';
import WordsList from "../../components/wordsList/wordsList";
import DictionaryFilters from "../../components/dictionaryFilters/dictionaryFilters";
import { useContext, useEffect, useReducer, useState, useMemo } from "react";
import { initialWordsState, wordsReducer, WordsContext, WORDS_ACTIONS } from "../../store/dictionary.store";
import { AppContext } from "../../store/store";
import { wordsService } from "../../services/words.service";
import DictionaryMenu from "../../components/dictionaryMenu/dictionaryMenu";
import { useGetWordsQuery } from '../../services/words.redux.js';

function DictionaryPage () {
  const {userState} = useContext(AppContext);
  const [wordsState, wordsDispatch] = useReducer(wordsReducer, initialWordsState);
  const [wordFilter, setWordFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState(false);

  const { data, isLoading, isFetching } = useGetWordsQuery(userState.user.id);
  const consoleData = useMemo(
    () => {
      console.log(data)
      return data
    },
    [data]
  )

  useEffect(() => {
    async function getWords (id) {
      const words = await wordsService.getWords(id);
      if (words) {
        wordsDispatch({type: WORDS_ACTIONS.UPD, words});
      } else {
        console.log('Empty');
      }
    }
    if (userState.isAuthorised) {
      getWords(userState.user.id);
    }
  }, [userState])

  const updateFiltered = (search, priority) => {
    setWordFilter(search);
    setPriorityFilter(priority);
  }

  const filteredWords = wordsState.filter((word) => {
    if (priorityFilter) {
      return word.word.toLowerCase().includes(wordFilter.toLowerCase()) && word.isPrioritized === priorityFilter;
    } else {
      return word.word.toLowerCase().includes(wordFilter.toLowerCase());
    }
  });
  
  const createPageContent = () => {
    if (userState.isAuthorised) {
      return (
        <div className="page-wrap">
          <DictionaryMenu/>
          <DictionaryFilters updater={updateFiltered}/>
          <WordsList words={filteredWords}/>
        </div>
      )
    } else {
       return <DictionaryPlaceholder type={'unauthorised'}/>;
    }
  }
  const pageContent = createPageContent();

  return (
   <WordsContext.Provider value={{wordsState, wordsDispatch}}>
     {pageContent}
   </WordsContext.Provider>
  )
}

export default DictionaryPage;