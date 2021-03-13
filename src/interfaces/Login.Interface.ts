export default interface LoginInterface  {
    showPassword: boolean;
    isDialogForgotPassword: boolean;
    email:string | null;
    password: string | null;
    opacity: number; //overlay
    isAbsolute: boolean; //overlay
    isOverlay: boolean; //overlay
}
