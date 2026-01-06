unit MainForm;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes,
  Vcl.Graphics, Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls, Vcl.ComCtrls,
  Controllers.TaskController,
  Controllers.UserController,
  Controllers.ProjectController,
  Services.AuthService,
  Models.User,
  Utils.Logger;

type
  TFormMain = class(TForm)
    ListView1: TListView;
    ButtonAddTask: TButton;
    ButtonRefresh: TButton;
    ButtonLogin: TButton;
    EditUsername: TEdit;
    EditPassword: TEdit;
    LabelStatus: TLabel;
    procedure FormCreate(Sender: TObject);
    procedure FormDestroy(Sender: TObject);
    procedure ButtonAddTaskClick(Sender: TObject);
    procedure ButtonRefreshClick(Sender: TObject);
    procedure ButtonLoginClick(Sender: TObject);
  private
    FTaskController: TTaskController;
    FUserController: TUserController;
    FProjectController: TProjectController;
    FAuthService: TAuthService;
    FLogger: TLogger;
    FCurrentUser: TUser;
    procedure LoadTasks;
    procedure UpdateStatusLabel(const AMessage: string);
  public
    { Public declarations }
  end;

var
  FormMain: TFormMain;

implementation

{$R *.dfm}

procedure TFormMain.FormCreate(Sender: TObject);
begin
  FLogger := TLogger.Create;
  FLogger.Log('Application starting...');
  
  FTaskController := TTaskController.Create;
  FUserController := TUserController.Create;
  FProjectController := TProjectController.Create;
  FAuthService := TAuthService.Create;
  
  UpdateStatusLabel('Ready');
end;

procedure TFormMain.FormDestroy(Sender: TObject);
begin
  FTaskController.Free;
  FUserController.Free;
  FProjectController.Free;
  FAuthService.Free;
  FLogger.Free;
  if Assigned(FCurrentUser) then
    FCurrentUser.Free;
end;

procedure TFormMain.ButtonLoginClick(Sender: TObject);
var
  Username, Password: string;
begin
  Username := EditUsername.Text;
  Password := EditPassword.Text;
  
  FLogger.Log('Attempting login for user: ' + Username);
  
  if FAuthService.Login(Username, Password) then
  begin
    FCurrentUser := FUserController.GetUserByUsername(Username);
    UpdateStatusLabel('Logged in as: ' + Username);
    FLogger.Log('Login successful');
    LoadTasks;
  end
  else
  begin
    UpdateStatusLabel('Login failed');
    FLogger.LogError('Login failed for user: ' + Username);
    ShowMessage('Invalid credentials');
  end;
end;

procedure TFormMain.ButtonAddTaskClick(Sender: TObject);
var
  TaskTitle: string;
begin
  if not Assigned(FCurrentUser) then
  begin
    ShowMessage('Please login first');
    Exit;
  end;
  
  TaskTitle := InputBox('New Task', 'Enter task title:', '');
  if TaskTitle <> '' then
  begin
    FTaskController.CreateTask(TaskTitle, FCurrentUser.GetId);
    FLogger.Log('Task created: ' + TaskTitle);
    LoadTasks;
  end;
end;

procedure TFormMain.ButtonRefreshClick(Sender: TObject);
begin
  LoadTasks;
end;

procedure TFormMain.LoadTasks;
var
  Tasks: TArray<TTask>;
  Task: TTask;
  Item: TListItem;
begin
  if not Assigned(FCurrentUser) then
    Exit;
    
  ListView1.Items.Clear;
  Tasks := FTaskController.GetUserTasks(FCurrentUser.GetId);
  
  for Task in Tasks do
  begin
    Item := ListView1.Items.Add;
    Item.Caption := Task.GetTitle;
    Item.SubItems.Add(Task.GetStatus);
  end;
  
  UpdateStatusLabel('Loaded ' + IntToStr(Length(Tasks)) + ' tasks');
end;

procedure TFormMain.UpdateStatusLabel(const AMessage: string);
begin
  LabelStatus.Caption := AMessage;
  Application.ProcessMessages;
end;

end.
