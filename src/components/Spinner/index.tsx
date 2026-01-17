const Spinner = () => {
  return (
    <section
      className={
        "fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center"
      }
    >
      <div
        className="inline-block w-12 h-12 box-border rounded-full
         border-4 border-white border-b-transparent
         animate-spin"
      />
    </section>
  );
};

export default Spinner;
