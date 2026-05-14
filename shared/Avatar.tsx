export function Avatar({
  className = "",
  id,
  src,
}: {
  className?: string;
  id?: string;
  src: string;
}) {
  return (
    <div className={`avatar-frame ${className}`.trim()}>
      <img className="avatar" id={id} src={src} alt="" />
    </div>
  );
}
