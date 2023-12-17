


export const Button = props => {
    return <button {...props} className={['text-white bg-black hover:bg-transparent hover:text-black border-2 border-black hover:border-black rounded-full px-8 py-[10px] text-base font-normal', props.className].join(' ')}>
        {props.children}
    </button>
}