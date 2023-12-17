export const Heading = (props) => {
  return (
    <h2 className=" mt-10 lg:mt-0 text-3xl md:text-5xl uppercase items-center text-center">
      {props.children}
    </h2>
  );
};
